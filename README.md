# ATTShapeHack2017
Team EmoBots software using IBM Watson API to create an emotional companion that detects your tone and mood and can respond with unique speech and movements.
at the AT&T SHAPE Hackathon in Los Angeles

<strong>I worked on the entire NodeJs express app and was responsible for using IBM Watson's Tone analyzer api, sending data back and forth to our robot.</strong>

My team and I developed a program that understands the way people feel based on their tone. We implemented this software with the actions of a robot. Thus allowing us to get closer to our goal; allow a robot to have micro-expressions and effectively communicate with a person. A user speaks to our robot, with any statement (not necessarily revealing how they feel), we record that statement and begin to process it.

"None of my friends can hang out today, I have to be alone again."

We take the users statement, convert it to text, and send it to my NodeJS express app. I then send that to IBM Watson's [Tone analyzer](https://tone-analyzer-demo.mybluemix.net/?cm_mc_uid=89411517825914981005334&cm_mc_sid_50200000=1501627187&cm_mc_sid_52640000=1501627187) API. It would process the statement and detect a percentage of Anger, Disgust, Sadness, Fear, and Joy.
Emotion

From the users statement we would get these percentages:
(Anger 0.10)
(Disgust 0.02)
(Fear 0.26)
(Joy 0.13)
(Sadness 0.67)


Our NodeJs app took this data, determined what the three highest Emotions were, and used that to respond with an appropriate statement.
An example response would be, <strong>"Be cool, and do not worry, it will be okay. Let us watch The Body Guard"</strong>.

We sent this response to our robot, which used IBMs text to speech API to play it back to the user. On top of this our robot did a different movement for each response, for example high levels of happiness it would spin around, or anger and it would back up slowly.

We wanted to go one step further with IBM's API and tone analyzation, so we attempted to detect <strong>Sarcasm</strong>. We did some research and needed to determine what emotions would make a sarcastic response.
We determined that if the users tone showed high levels of Anger, Disgust, Joy they were making a sarcastic response. Our robot would respond with:
"Ok captain obvious!".

I hope to make the way our classifier more complex and give many different responses for varying levels of each emotion.
