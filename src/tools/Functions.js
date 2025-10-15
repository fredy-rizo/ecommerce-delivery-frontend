const searchLinksinText = (texto) => {
    // Expresión regular para detectar enlaces
    const regexEnlaces = /https?:\/\/[^\s]+/g;

    // Reemplaza los enlaces en el texto con enlaces clickeables
    return texto.replace(regexEnlaces, (enlace) => {
        return `<a href="${enlace}" target="_blank">${enlace}</a>`;
    });
}

export { searchLinksinText }