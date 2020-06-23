export function removeAccents(str) {
  var accents =
    "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  var accentsOut =
    "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split("");
  var strLen = str.length;
  var i, x;
  for (i = 0; i < strLen; i++) {
    if ((x = accents.indexOf(str[i])) != -1) {
      str[i] = accentsOut[x];
    }
  }
  return str.join("").toLowerCase();
}

export function getErrorMessage(ex) {
  if (ex && ex.response && ex.response.data && ex.response.data.error) {
    return ex.response.data.error.message;
  } else {
    if (ex && ex.message) {
      return ex.message
    } else {
      return "Error inesperado, vuelva a intentar más tarde."
    }
  }


}
