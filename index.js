var DateTime = luxon.DateTime;
var listOfTimezones = Intl.supportedValuesOf('timeZone')

function buildHTMLResults(lookupDict, results){
  var strBuild = ''
  results.forEach(function(item){
    strBuild += '<div>'+lookupDict[item].stringified+' ('+item+')</div>'
  })
  return strBuild
}

function init(){
  var currentTime = DateTime.now()
  var stringifiedLocalTime = currentTime.toLocaleString(DateTime.DATETIME_FULL);

  document.getElementById('isoHook').innerHTML = currentTime.toISO()
  document.getElementById('zoneNameHook').innerHTML = currentTime.zoneName
  document.getElementById('formattedCurrentTimeHook').innerHTML = stringifiedLocalTime

  //create a map of zones to new luxon objects created by setZone
  tzDateLookupDict = {}
  listOfTimezones.forEach(function(tzName){
    var newLuxonObj = currentTime.setZone(tzName)
    tzDateLookupDict[tzName] = {
      dateObj: newLuxonObj,
      stringified: newLuxonObj.toLocaleString(DateTime.DATETIME_FULL),
      timePortion: newLuxonObj.toLocaleString(DateTime.DATETIME_FULL).match(/at (\d+:\d\d\W\w\w) /i)[1]
    }
  })

  //find all that happens at 5pm
  var found = Object.keys(tzDateLookupDict).filter(function(tzName){
    var matches = tzDateLookupDict[tzName].timePortion.match(/(\d+):(\d+) (\w\w)/i)

    return matches[3] == "PM" && matches[1] == "5"
  })

  document.getElementById('resultsHook').innerHTML = buildHTMLResults(tzDateLookupDict, found)
}
