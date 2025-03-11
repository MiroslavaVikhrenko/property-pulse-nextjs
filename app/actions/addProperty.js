'use server';

async function addProperty(formData) {
    console.log(formData.get('name'))
}

export default addProperty;