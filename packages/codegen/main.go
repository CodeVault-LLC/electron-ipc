package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"codevault.no/electron-ipc-gen/parser"
)

func main() {
	// Expect a argument to be passed telling the config path
	if len(os.Args) < 2 {
		fmt.Println("Usage: codegen <config_path>")
		return
	}

	// Read the config file to get the root directory
	configPath := os.Args[1]
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		fmt.Println("Config file does not exist:", configPath)
		return
	}

	// The configuration file we expect should be a JSON file with a "root" field
	// Now parse the config file to get the root directory
	var config struct {
		Root               string `json:"root"`
		TypeDefinitionFile string `json:"typeDefinitionFile"`
	}

	configOutput, err := os.ReadFile(configPath)
	if err != nil {
		fmt.Println("Failed to read config file:", err)
		return
	}

	err = json.Unmarshal(configOutput, &config)
	if err != nil {
		fmt.Println("Failed to parse config file:", err)
		return
	}

	if config.Root == "" {
		fmt.Println("No root directory specified in config, using default.")
		config.Root = "../../examples/electron-vite/src/main/"
	}

	if config.TypeDefinitionFile == "" {
		config.TypeDefinitionFile = "ipc.d.ts"
	}

	rootDir := filepath.Join(filepath.Dir(configPath), config.Root)

	var tsFiles []string
	err = filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if filepath.Ext(path) == ".ts" {
			tsFiles = append(tsFiles, path)
		}
		return nil
	})
	if err != nil {
		fmt.Println("Failed to read files:", err)
		return
	}

	routes := make(map[string]parser.RouteDef)
	for _, file := range tsFiles {
		fileRoutes, err := parser.ParseDeclareRoutes(file)
		if err != nil {
			fmt.Println("Error parsing", file, ":", err)
			continue
		}
		for k, v := range fileRoutes {
			routes[k] = v
		}
	}

	outputPath := filepath.Join(filepath.Dir(configPath), config.TypeDefinitionFile)

	err = parser.WriteIPCDefinition(outputPath, routes)
	if err != nil {
		fmt.Println("Failed to write ipc.d.ts:", err)
	} else {
		fmt.Println("Generated ipc.d.ts")
	}
}
