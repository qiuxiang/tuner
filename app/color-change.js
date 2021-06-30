var refreshTime = 100; //microseconds
var sensitivity = 2; // + and - interval


function colorChange() {
  var el = document.getElementById("meter-pointer");
  var st = window.getComputedStyle(el, null);
  var tr = st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "FAIL";

  //
  //console.log('Matrix: ' + tr);
  //

  var values = tr.split('(')[1].split(')')[0].split(',');
  var a = values[0];
  var b = values[1];
  var c = values[2];
  var d = values[3];

  var scale = Math.sqrt(a * a + b * b);

  //
  //console.log('Scale: ' + scale);
  //

  var sin = b / scale;
  var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  //
  //console.log('Rotate: ' + angle + 'deg');
  //

  if (angle >= -sensitivity && angle <= sensitivity) {
    $('.plus').css('color', 'green')
    $('.minus').css('color', 'green')
    $('.color-change').css('background-color', 'green')
  }
  else if (angle < -sensitivity) {
    $('.plus').css('color', 'gray')
    $('.minus').css('color', 'red')
    $('.color-change').css('color', '#748291')
    $('.color-change').css('background-color', '#748291')
  }
  else if (angle > sensitivity) {
    $('.plus').css('color', 'red')
    $('.minus').css('color', 'gray')
    $('.color-change').css('background-color', '#748291')
  }
}

$(document).ready(function () {
  setInterval(colorChange, refreshTime);
})
