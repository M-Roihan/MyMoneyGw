<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhotoProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo_profile' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048', // Max 2MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'photo_profile.required' => 'Foto profil wajib diunggah',
            'photo_profile.image' => 'File harus berupa gambar',
            'photo_profile.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif',
            'photo_profile.max' => 'Ukuran gambar tidak boleh lebih dari 2MB',
        ];
    }
}
