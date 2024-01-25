package main

import (
	"encoding/hex"
	"fmt"
)

func main() {
	decoded, err := hex.DecodeString("f8668085ba43b7400082af03947dcb32ffffe697133f12b4f38e6c3b642fdd014880b844a9059cbb0000000000000000000000005f90d10443b03f46a6c3513fe62f60733e7bcea70000000000000000000000000000000000000000000000000de0b6b3a7640000")
	if err != nil {
		fmt.Printf("err %s", err.Error())
	}
	fmt.Println(decoded)
}
