function validate(e) {
  e.preventDefault();

  let form = e.srcElement;
  let flag = false; // 只有此处 flag = true 代表有验证不通过
  Array.prototype.forEach.call(document.querySelectorAll('input[type=text]'), function (el) {
    let fakeEvent = {
      srcElement: el
    };
    if (!validateNull(fakeEvent)) {
      flag = true;
    }
  });

  if (!validateFun(document.getElementById('newbie_name'), function (el) {
      return el.value.replace(/^\s+|\s+$/g,"").length < 20
    }, "你名字太长啦！")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_phone'), function (el) {
      return el.value.replace(/^\s+|\s+$/g,"").match(/1[0-9]{10}/)
    }, "手机号数错了吧~")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_qq'), function (el) {
      return el.value.replace(/^\s+|\s+$/g,"").match(/[1-9][0-9]{5,13}/)
    }, "你的QQ很神奇")) {
    flag = true;
  }
  if (!validateFun(document.getElementById('newbie_bio'), function (el) {
      return el.value.replace(/^\s+|\s+$/g,"").length < 500
    }, "个人简介太长，又不是写论文~")) {
    flag = ture;
  }

  if (!validateChecked(document.querySelectorAll("[name='newbie[sex]']"))){
    flag = true;
  }
  if (!validateChecked(document.querySelectorAll("[name='newbie[group]']"))) {
    flag = true;
  }
  if (!flag) {
    let XHR = new XMLHttpRequest();
    let FD  = new FormData();

    for (let i = 0, input, value; i < form.elements.length; i++) {
      input = form.elements[i];
      if (input.name && input.value) {
        value = (input.type == "checkbox" || input.type == "radio" ? (input.checked ? input.value : '') : input.value);
        if (value) FD.append(input.name, value.replace(/^\s+|\s+$/g,""));
      }
    }

    XHR.onreadystatechange = function () {
      if(XHR.readyState === XMLHttpRequest.DONE) {
        if (XHR.status == 200) {
          alert("报名成功！")
        } else {
          console.log(XHR);
          alert("报名失败！" + XHR.responseText)
        }
        document.getElementById('loading').classList.add('hide');

      }
    };
    document.getElementById('loading').classList.remove('hide');
    XHR.open('POST', form.action);
    XHR.send(FD);
  }
}

function isNotNull(el) {
  return el.value.replace(/^\s+|\s+$/g,"") != ""
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

function validateFun(el, fun, msg) {
  return toggleWarn(el, fun(el), msg)
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