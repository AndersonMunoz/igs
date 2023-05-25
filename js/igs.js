let mini=document.querySelector('#mini');
let full=document.querySelector('#full');
let mian=document.getElementById('menuHamb');


mian.addEventListener('click', function () {

    if (mini.classList.contains('none')) {
        mini.classList.add('menu');
        mini.classList.remove('none');
        full.classList.remove('menu');
        full.classList.add('none');
    }else{
        mini.classList.remove('menu');
        mini.classList.add('none');
        full.classList.add('menu');
        full.classList.remove('none');
    }
}
);