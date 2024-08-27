document.getElementById('greetButton').addEventListener('click', function () {
    if (document.getElementById('greeting').innerText == '') {
        document.getElementById('greeting').innerText = '你好，欢迎来到我的网站！';
    } else {
        document.getElementById('greeting').innerText = '';  
    }
});
document.getElementsByTagName('button')[1].addEventListener('click', function () {
    document.getElementsByClassName('text')[2].innerHTML = 'U 已经 Click 了'
})
