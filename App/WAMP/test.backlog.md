## Backlog of features to test

* Constructor
  * It function is Defined
  * It builds connection with WAMP. Should connect with WAMP successfully
  * It build class variables. Should match expected
  * It is a singleton class. Should test like
  [so](http://amanvirk.me/singleton-classes-in-es6/)
* OnStatusChange
  * It function is Defined
  * It changes status on opening and closing connection. Should change
  accordingly
* OnOpen
  * It function is Defined
  * It is executed when connection is opened. Should be executed
* OnClose
  * It function is Defined
  * It is executed when connection is closed. Should be executed
* Subscribe/Publish
  * It function is Defined
  * It subscribe to a topic. Then topic is published. Should received published
  message on callback function.
