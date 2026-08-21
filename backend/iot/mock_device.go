package main

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// IoTCommand represents the payload expected from the backend
type IoTCommand struct {
	Command         string  `json:"command"`
	DurationMinutes float64 `json:"duration_minutes"`
}

func main() {
	// The simulated Device ID (must match what's in the database for the premium farm)
	deviceID := "ESP32-Kijani-001"
	brokerURI := "tcp://localhost:1883"
	topic := fmt.Sprintf("amatsi/devices/%s", deviceID)

	opts := mqtt.NewClientOptions()
	opts.AddBroker(brokerURI)
	opts.SetClientID(deviceID + "-Simulator")

	// Message handler when a command is received
	opts.SetDefaultPublishHandler(func(client mqtt.Client, msg mqtt.Message) {
		log.Printf("Received message on topic: %s", msg.Topic())
		
		var cmd IoTCommand
		if err := json.Unmarshal(msg.Payload(), &cmd); err != nil {
			log.Printf("Failed to parse command payload: %v", err)
			return
		}

		if cmd.Command == "OPEN_VALVE" {
			log.Println("==================================================")
			log.Printf("💧 ACTION: OPENING VALVE FOR %s", deviceID)
			log.Printf("⏱️ DURATION: %.1f minutes", cmd.DurationMinutes)
			log.Println("==================================================")

			// Simulate the watering duration (sped up for demonstration)
			go func(duration float64) {
				log.Println("Irrigation started...")
				// In reality, this sleeps for `duration` minutes.
				// We sleep for 5 seconds for simulation purposes.
				time.Sleep(5 * time.Second)
				log.Println("✅ ACTION: CLOSING VALVE (Timer finished safely at the edge)")
			}(cmd.DurationMinutes)
		}
	})

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatalf("Failed to connect to MQTT broker: %v", token.Error())
	}
	log.Printf("Connected to MQTT Broker at %s", brokerURI)

	if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		log.Fatalf("Failed to subscribe to topic %s: %v", topic, token.Error())
	}
	log.Printf("Subscribed to topic: %s. Listening for commands...", topic)

	// Keep the simulator running until interrupted
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down simulator...")
	client.Disconnect(250)
}
