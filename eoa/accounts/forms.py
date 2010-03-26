from django import forms as baseForms

from eoa.accounts.models import *

from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.admin.widgets import AdminDateWidget



class RegisterForm(ContactInfoForm):
    username = forms.CharField(label="Username")
    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

#    class Meta:
#        model = Person
#        exclude = ('user')

    def clean_username(self):
        username = self.cleaned_data["username"]
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError("A user with that username already exists.")

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1", "")
        password2 = self.cleaned_data["password2"]
        if password1 != password2:
            raise forms.ValidationError("The two password fields didn't match.")
        return password2


    def save(self, commit=True):
        username = self.clean_username()
        password = self.clean_password2()
        new_user = User.objects.create(username=username) 
        new_user.save()
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
        #new lines necessary to create Person object when creating a User
        person = Person(user=user)
        person.save()

        self.instance.user_id = user.id
        forms.models.save_instance(self, user.get_profile(), commit=True)
        return user
