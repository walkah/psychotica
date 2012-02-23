$(document).ready(function() {
  $("#browserid").click(function(){
    navigator.id.getVerifiedEmail(function(assertion) {
      if (assertion) {
        $("input").val(assertion);
        $("form").submit();
      } else {
        location.reload();
      }
    });
  });
});
