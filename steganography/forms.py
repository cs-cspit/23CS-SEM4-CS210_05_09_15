from django import forms
from .models import Upload

class UploadForm(forms.ModelForm):
    # Additional fields (not stored in DB)
    secret_message = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3, 'placeholder': 'Enter your secret message'}),
        required=True,
        label="Secret Message"
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Enter a strong password'}),
        required=True,
        label="Password"
    )

    class Meta:
        model = Upload
        fields = ['upload_type', 'original_file']


class DecodeForm(forms.Form):
    stego_file = forms.FileField(label="Upload Stego File")
    password = forms.CharField(widget=forms.PasswordInput(), label="Enter Password")