<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
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
            'current_password' => [
                'required',
                'current_password',
            ],
            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/^[a-zA-Z0-9]+$/',
                'confirmed',
            ],
            'password_confirmation' => [
                'required',
                'string',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Password saat ini wajib diisi',
            'current_password.current_password' => 'Password saat ini tidak sesuai',
            'password.required' => 'Password baru wajib diisi',
            'password.min' => 'Password harus minimal 6 karakter',
            'password.regex' => 'Password hanya boleh berisi huruf dan angka (tidak boleh ada spasi atau simbol)',
            'password.confirmed' => 'Konfirmasi password tidak sesuai',
            'password_confirmation.required' => 'Konfirmasi password wajib diisi',
        ];
    }
}
