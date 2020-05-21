document.querySelector('#formId').addEventListener('submit', async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('photo', document.querySelector('#photo').files[0]);

    const uploadReq = await axios({
        method: 'POST',
        url: '/upload',
        data: form
    });

    document.querySelector('.dynamicContent').setAttribute('style', 'display: flex;');
    document.querySelector('.dynamicContent div p').innerHTML = uploadReq.data.text.replace(/\n/g, '<br>');
    document.querySelector('.dynamicContent img').setAttribute('src', `upload/${uploadReq.data.filename}`);
});

document.querySelector('#resetContent').addEventListener('click', async () => {
    const filename = document.querySelector('.dynamicContent img').getAttribute('src');
    const res = await axios({
        method: 'POST',
        url: '/delete?filename=' + filename
    });
    window.location.assign('/');
});