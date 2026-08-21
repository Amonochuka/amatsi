package clients

import (
	"encoding/json"
	"fmt"
	mqtt "github.com/eclipse/paho.mqtt.golang"
	"time"
)

type MQTTClient struct {
	client mqtt.Client
}

type IoTCommand struct {
	Command         string  `json:"command"`
	DurationMinutes float64 `json:"duration_minutes"`
}

func NewMQTTClient(brokerURI, clientID string) (*MQTTClient, error) {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(brokerURI)
	opts.SetClientID(clientID)
	opts.SetPingTimeout(1 * time.Second)
	opts.SetKeepAlive(2 * time.Second)

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		return nil, fmt.Errorf("failed to connect to mqtt broker: %w", token.Error())
	}

	return &MQTTClient{client: client}, nil
}

func (m *MQTTClient) TriggerIrrigation(deviceID string, durationMinutes float64) error {
	topic := fmt.Sprintf("amatsi/devices/%s", deviceID)
	cmd := IoTCommand{
		Command:         "OPEN_VALVE",
		DurationMinutes: durationMinutes,
	}

	payload, err := json.Marshal(cmd)
	if err != nil {
		return err
	}

	token := m.client.Publish(topic, 1, false, payload)
	token.Wait()
	if token.Error() != nil {
		return fmt.Errorf("failed to publish mqtt message: %w", token.Error())
	}

	return nil
}
