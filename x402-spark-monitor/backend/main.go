package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/ethereum/go-ethereum/crypto"
)

type PaymentAccept struct {
	Scheme            string `json:"scheme"`
	Network           string `json:"network"`
	MaxAmountRequired string `json:"maxAmountRequired"`
	Resource          string `json:"resource"`
	PayTo             string `json:"payTo"`
	Asset             string `json:"asset"`
}

type PaymentResponse struct {
	Error   string          `json:"error"`
	Accepts []PaymentAccept `json:"accepts"`
}

func main() {
	url := "http://localhost:4021/premium/content"

	// Step 1: Request the content without payment
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Println("Initial Response:", string(body))

	var payResp PaymentResponse
	if err := json.Unmarshal(body, &payResp); err != nil {
		log.Fatal("❌ Failed to parse response:", err)
	}

	if len(payResp.Accepts) == 0 {
		log.Fatal("❌ No payment schemes found")
	}

	accept := payResp.Accepts[0]

	// Step 2: Prepare signing data
	message := fmt.Sprintf(
		"Pay %s tokens to %s for %s on %s",
		accept.MaxAmountRequired, accept.PayTo, accept.Resource, accept.Network,
	)
	fmt.Println("Signing message:", message)

	// Step 3: Sign with private key
	privateKeyHex := "de359e567ec1d89c46f9fd124d3e6cdd5530cee1e7ec191f769ff59048d05bb1"
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		log.Fatal("❌ Invalid private key:", err)
	}

	hash := crypto.Keccak256Hash([]byte(message))
	signature, err := crypto.Sign(hash.Bytes(), privateKey)
	if err != nil {
		log.Fatal("❌ Failed to sign message:", err)
	}

	address := crypto.PubkeyToAddress(privateKey.PublicKey)
	fmt.Println("✅ Signed by:", address.Hex())

	// Step 4: Add X-PAYMENT header and resend
	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)

	xPaymentHeader := fmt.Sprintf("sig=%x;from=%s;amount=%s;asset=%s;to=%s",
		signature, address.Hex(), accept.MaxAmountRequired, accept.Asset, accept.PayTo,
	)
	req.Header.Set("X-PAYMENT", xPaymentHeader)

	resp2, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp2.Body.Close()

	content, _ := io.ReadAll(resp2.Body)
	fmt.Println("🔓 Final Response:", string(content))
}
