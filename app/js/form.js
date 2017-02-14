function validate(e) {
  let flag = false;
  Array.prototype.forEach.call(document.querySelectorAll('input[type=text]'), function (el) {
    let fakeEvent = {
      srcElement: el
    };
    if (!validateNull(fakeEvent)) {
      flag = true;
    }
  });
  validateChecked(document.querySelectorAll("[name='newbie[sex]']"))
  validateChecked(document.querySelectorAll("[name='newbie[group]']"))
  if (flag) {
    e.preventDefault();
  }
}

function isNotNull(el) {
  return el.value != ""
}

function toggleWarn(el, flag, msg) {
  if (!flag) {
    el.parentElement.getElementsByClassName('error')[0].innerText = msg;
    el.parentElement.classList.add('warn');
  } else {
    // el.parentElement.getElementsByClassName('error')[0].innerText = "";
    el.parentElement.classList.remove('warn');
  }
  return flag;
}

function validateNull(e) {
  let el = e.srcElement;
  return toggleWarn(el, isNotNull(el), "别忘了填哦~");
}

function validateChecked(arr) {
  let flag = false;
  arr.forEach(function (el) {
    if (el.checked) {
      flag = true;
    }
  });
  return toggleWarn(arr[0], flag, "别闹，乖乖选一个");
}

Array.prototype.forEach.call(document.querySelectorAll('input[type=text]'), function (el) {
  el.addEventListener('blur', validateNull);
});

document.getElementsByTagName('form')[0].addEventListener('submit', validate);
Array.prototype.forEach.call(document.querySelectorAll("[type=radio]"), function (el) {
  el.addEventListener('click', function (e) {
      toggleWarn(e.srcElement, true, "");
    }
  );
});