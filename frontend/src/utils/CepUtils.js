export const HandleCepBlur = async (cep, setFormData) => {
    console.log(cep)

   
    const cepLocal = cep ? cep.replace(/\D/g, "") : 0


    if (cepLocal.length != 8) {
        return false;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLocal}/json/`);
        const data = await response.json();
        if (!data.erro) {
            setFormData((prevData) => ({
                ...prevData,
                street: data.logradouro,
                district: data.bairro,
                city: data.localidade,
                state: data.uf,
            }));
            return true;
        } else {
            alert('CEP não encontrado');
            return false;
        }
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        return false;
    }
};

export default HandleCepBlur;
