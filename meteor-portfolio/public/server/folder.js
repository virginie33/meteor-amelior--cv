// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    //actual email sending method
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});
Meteor.methods({
  sendEmail: function (text) {
    check([text], [String]);

    this.unblock();

    Email.send({
      to: 'medinini@hotmail.fr',
      from: 'contact@myClientProject.com',
      subject: 'New message from contact form',
      text: text
    });
  }
});
Template.contactFormTemplate.events({
	'submit form#contactForm':function(e){
		var contactForm = $(e.currentTarget),
			fname = contactForm.find('#firstName').val(),
			lname = contactForm.find('#lastName').val(),
			email = contactForm.find('#email').val(),
			phone = contactForm.find('#phone').val(),
			message = contactForm.find("#message").val();

		//isFilled and isEmail are my helper methods, which checks if variable exists or is email address valid
		if(isFilled(fname) && isFilled(lname) && isFilled(email) && isFilled(phone) && isFilled(message) && isEmail(email)){
			var dataText = "Message from: " + fname + " " + lname + "\rEmail: " + email + "\rPhone: " + phone + "\rContent:" + message;

			Meteor.call('sendEmail', dataText);
			//throwAlert is my helper method which creates popup with message
			throwAlert('Email send.', 'success');
		}else{
			throwAlert('An error occurred. Sorry', 'error');
			return false;
		}
	}
});
