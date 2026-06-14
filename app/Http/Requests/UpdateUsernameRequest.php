<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsernameRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                'min:3',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter',
            'name.min' => 'Nama harus minimal 3 karakter',
        ];
    }
}
