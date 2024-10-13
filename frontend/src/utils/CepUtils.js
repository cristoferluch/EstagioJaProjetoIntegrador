export const HandleCepBlur = async (cep, setFormData) => {
    console.log(cep)
    const cepLocal = cep.replace(/\D/g, "");

    if (cepLocal.length != 8) {
        return false;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLocal}/json/`);
        const data = await response.json();
        if (!data.erro) {
            setFormData((prevData) => ({
                ...prevData,
                endereco: data.logradouro,
                bairro: data.bairro,
                municipio: data.localidade,
                uf: data.uf,
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
