function validate(e) {
  e.preventDefault();

  let form = e.srcElement;
  let flag = false; // 只有此处 flag = true 代表有验证不通过

  // bio
  if (!validateNull(document.getElementById('newbie_bio'))) {
    flag = true;
  }

  if (!validateNull(document.getElementById('newbie_grade_class'))) {
    flag = true;
  }

  // name
  if (!validateNull(document.getElementById('newbie_name')) || !validateFun(document.getElementById('newbie_name'), function (el) {
      return el.value.replace(/^\s+|\s+$/g,"").length < 20
    }, "你名字太长啦！")) {
    flag = true;
  }
  if (!validateNull(document.getElementById('newbie_phone')) || !validateFun(document.getElementById('newbie_phone'), function (el) {
      return el.value.replace(/\s+/g,"").length < 12 && el.value.replace(/\s+/g,"").match(/1[0-9]{10}\b/)
    }, "手机号数错了吧~")) {
    flag = true;
  }
  if (!validateNull(document.getElementById('newbie_qq')) || !validateFun(document.getElementById('newbie_qq'), function (el) {
      return el.value.replace(/\s+/g,"").length < 14 && el.value.replace(/\s+/g,"").match(/[1-9][0-9]{5,13}\b/)
    }, "你的QQ很神奇")) {
    flag = true;
  }
  if (!validateNull(document.getElementById('newbie_bio')) || !validateFun(document.getElementById('newbie_bio'), function (el) {
      return el.value.length < 500
    }, "个人简介太长，又不是写论文~")) {
    flag = true;
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
        if (value) {
          FD.append(input.name, input.name.match(/qq|phone/) ? value.replace(/\s+/g,"") : value.replace(/^\s+|\s+$/g,""));
        }
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

function validateNull(el) {
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
  el.addEventListener('blur', function (e) {
    validateNull(e.srcElement);
  });
});

document.getElementsByTagName('form')[0].addEventListener('submit', validate);
Array.prototype.forEach.call(document.querySelectorAll("[type=radio]"), function (el) {
  el.addEventListener('click', function (e) {
      toggleWarn(e.srcElement, true, "");
    }
  );
});