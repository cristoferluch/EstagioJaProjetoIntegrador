package validation

import (
	"net/mail"
	"regexp"
	"strconv"
)

func IsEmailValid(email string) bool {

	_, err := mail.ParseAddress(email)

	return err == nil
}

func IsCpfValid(cpf string) bool {

	// Remove os strings
	re := regexp.MustCompile(`[^\d]`)
	cpf = re.ReplaceAllString(cpf, "")

	// Verifica tamanho
	if len(cpf) != 11 {
		return false
	}

	// Transforma em um slice
	var numbers [11]int
	for i, s := range cpf {
		num, err := strconv.Atoi(string(s))
		if err != nil {
			return false
		}
		numbers[i] = num
	}

	// Verifica digitos repetitivos
	flag := false
	first := numbers[0]
	for _, elem := range numbers {
		if elem != first {
			flag = true
		}
	}

	if !flag {
		return flag
	}

	n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11 := numbers[0], numbers[1], numbers[2], numbers[3], numbers[4], numbers[5], numbers[6], numbers[7], numbers[8], numbers[9], numbers[10]

	// Validação do primeiro dígito
	result := n1*10 + n2*9 + n3*8 + n4*7 + n5*6 + n6*5 + n7*4 + n8*3 + n9*2
	if (result*10)%11 != numbers[9] {
		return false
	}

	// Validação do segundo dígito
	result = n1*11 + n2*10 + n3*9 + n4*8 + n5*7 + n6*6 + n7*5 + n8*4 + n9*3 + n10*2
	if (result*10)%11 != n11 {
		return false
	}

	return true
}
