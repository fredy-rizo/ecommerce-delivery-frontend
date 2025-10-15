const validateRequire = (data, rules) => {
    let fails = []
    for (let index = 0; index < rules.length; index++) {
        const element = rules[index];
        if (data[element] == null || data[element] == "") {
            fails.push({ message: "Este campo es requerido.", data: element })
        }
    }
    if (fails.length > 0) {
        return { status: false, fails }
    }
    return { status: true, fails }
}


export { validateRequire }