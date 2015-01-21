var pubnub;
var uniqueid;
var slider;
 
function setup() 
{
  // canvas size
  createCanvas(1000, 1600);
 
  // HSB: Hue Saturation Brightness
  colorMode(HSB, 255);
  
  // slider has a range between 0 and 255 with a starting value of 127
  slider = createSlider(0, 255, 127);
  slider.position(60, 25);
 
  // create a unique_id
  uniqueid = PUBNUB.uuid();
 
  // initialize pubnub
  pubnub = PUBNUB.init(
  {
    publish_key   : 'pub-c-1a91967b-b933-4bba-bf6f-324f9b35740d',
    subscribe_key : 'sub-c-9623189a-a062-11e4-8dd9-02ee2ddab7fe',
    uuid: uniqueid
  });
 
  // subscribe to drawing channel
  pubnub.subscribe(
  {
    channel : "drawing",
    message: handleMessage
  });
}
 
function draw() 
{
   // draw a color swatch
   noStroke();
   fill(slider.value(), 255, 255);
   rect(25, 25, 25, 25);
}
 
function touchStarted()
{
  if(touchY > 100)
  {
    // publish drawing data
    pubnub.publish(
    {
      channel: 'drawing',
      message: {
        x: touchX,
        y: touchY,
        c: slider.value(),
        uniqueid: uniqueid
      }
    });
 
    // draw what the user is drawing immediately
    noStroke();
    fill(slider.value(), 255, 255);
    ellipse(touchX, touchY, 20, 20);
  }
}

function draw() 
{
  // for each touch
  for(var i = 0; i < touches.length; i++)
  {
    // publish drawing data
    pubnub.publish(
    {
      channel: 'drawing',
      message: {
        x: touchX,
        y: touchY,
        c: slider.value(),
        uniqueid: uniqueid
      }
    });
 
    // draw what the user is drawing immediately
    noStroke();
    ellipse(touches[i].x, touches[i].y, 20, 20);    
  }
}
 
// when we receive a message from pubnub
function handleMessage(message) 
{
  // draw a circle on the screen if the user is someone else
  if(message.uniqueid != uniqueid)
  {
    noStroke();
    fill(message.c, 255, 255);
    ellipse(message.x, message.y, 20, 20);
  }
}