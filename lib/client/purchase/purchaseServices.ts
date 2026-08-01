export const personal_data_fields = ["name", "contactNumber", "contactMail"];
export const dir_fields = ["street", "number", "locality", "province", "zipCode", "floor", "apt", "additional"];


export function isNumeric(val: string): boolean {
    return /^\d+$/.test(val);
};

export function validateMail(mail: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail);
}

export function getErrorText(name: string, val: string): string {
  
    if (name == dir_fields[5] || name == dir_fields[6] || name == dir_fields[7]){
        return ""
    }

    let toRet = "";
    const value = val;
    if (!value) {

        toRet = "Este campo no puede estar vacío"
    }

    switch (name) {
        case dir_fields[1]:
        case personal_data_fields[1]:
            if (!isNumeric(value)) {
                toRet = "Este campo debe contener un número";
            }
            break;
        case personal_data_fields[2]:
            if (!validateMail(value)) {
                toRet = "Mail inválido";
            }
            break;
        case dir_fields[4]:
            console.log(`Value: ${value}Lenght ${value.length}`)
            if (value.length != 4) {
                toRet = "Este campo debe tener 4 digitos";
            }
            break;
    }
    return toRet;
}