from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from .forms import UploadForm, DecodeForm
from .models import Upload
from .utils.crypto import encrypt_message, decrypt_message
from .utils.stegano import hide_data_in_image, hide_data_in_audio, hide_data_in_video, extract_data_from_image, extract_data_from_audio, extract_data_from_video
import os
from django.http import HttpResponse


# Create your views here.

def home(request):
    return render(request, 'steganography/home.html')
# def upload(request):
#     return HttpResponse('upload')#render(request, 'core/upload.html')

def upload(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            upload_obj = form.save(commit=False)  # Save file/type but not yet commit to DB

            secret_message = form.cleaned_data['secret_message']
            password = form.cleaned_data['password']
            
            # Encrypt the message
            encrypted_json = encrypt_message(secret_message, password)

            # Paths
            original_path = upload_obj.original_file
            filename = os.path.basename(original_path.name)

            # Save the uploaded original file
            upload_obj.save()

            # Now hide data based on type
            input_path = upload_obj.original_file.path

            # Generate stego output path
            if upload_obj.upload_type == 'image':
                output_path = input_path.replace('original_files', 'stego_files')
                hide_data_in_image(input_path, encrypted_json, output_path)

            elif upload_obj.upload_type == 'audio':
                output_path = input_path.replace('original_files', 'stego_files')
                hide_data_in_audio(input_path, encrypted_json, output_path)

            elif upload_obj.upload_type == 'video':
                output_path = input_path.replace('original_files', 'stego_files')
                hide_data_in_video(input_path, encrypted_json, output_path)

            else:
                return render(request, 'core/error.html', {'error': 'Unsupported file type'})

            # Update stego_file field in DB
            upload_obj.stego_file.name = output_path.replace(os.path.join(os.getcwd(), 'media') + os.sep, '').replace("\\", "/")
            upload_obj.save()

            return redirect('result', pk=upload_obj.pk)
    else:
        form = UploadForm()

    return render(request, 'steganography/upload.html', {'form': form})

# def result(request, pk):
#     upload_obj = Upload.objects.get(pk=pk)
#     return render(request, 'steganography/result.html', {'upload': upload_obj})
def result(request, pk):
    file_obj = get_object_or_404(Upload, id=pk)

    stego_url = settings.MEDIA_URL + str(file_obj.stego_file)

    return render(request, 'steganography/result.html', {'stego_url': stego_url})

# def result(request):
#     return HttpResponse('result')#render(request, 'core/result.html')


def decode(request):
    message = None
    error = None

    if request.method == 'POST':
        form = DecodeForm(request.POST, request.FILES)
        if form.is_valid():
            stego_file = form.cleaned_data['stego_file']
            password = form.cleaned_data['password']
            temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', stego_file.name)

            # Save temporarily
            os.makedirs(os.path.dirname(temp_path), exist_ok=True)
            with open(temp_path, 'wb+') as destination:
                for chunk in stego_file.chunks():
                    destination.write(chunk)

            try:
                # Detect file type from extension
                ext = stego_file.name.lower().split('.')[-1]

                if ext in ['png', 'jpg', 'jpeg']:
                    extracted_json = extract_data_from_image(temp_path)
                elif ext in ['wav']:
                    extracted_json = extract_data_from_audio(temp_path)
                elif ext in ['avi', 'mp4']:
                    extracted_json = extract_data_from_video(temp_path)
                else:
                    error = "Unsupported file type!"
                    extracted_json = None

                if extracted_json:
                    message = decrypt_message(extracted_json, password)

            except Exception as e:
                error = f"Failed to extract/decrypt: {str(e)}"

            os.remove(temp_path)  # Clean up temp

    else:
        form = DecodeForm()

    return render(request, 'steganography/decode.html', {
        'form': form,
        'message': message,
        'error': error
    })
