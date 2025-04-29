from django.db import models

class Upload(models.Model):
    UPLOAD_TYPE_CHOICES = (
        ('image', 'Image'),
        ('audio', 'Audio'),
        ('video', 'Video'),
    )

    upload_type = models.CharField(max_length=10, choices=UPLOAD_TYPE_CHOICES)
    original_file = models.FileField(upload_to='original_files/')
    stego_file = models.FileField(upload_to='stego_files/', blank=True, null=True)
    upload_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.upload_type} uploaded at {self.upload_time}"
