<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/google-auth/redirect', function () {
    return Socialite::driver('google')->redirect();
});
 
Route::get('/google-auth/callback', function () {
    $user_google = Socialite::driver('google')->stateless()->user();

    $user = User::updateOrCreate([
        'email' => $user_google->email,
    ], [
        'name' => $user_google->name,
        'email' => $user_google->email,
    ]);

    Auth::login($user, true);

    return redirect('/dashboard');
});

Route::get('/github-auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});
 
Route::get('/github-auth/callback', function () {
    $user_github = Socialite::driver('github')->stateless()->user();

    $user = User::updateOrCreate([
        'email' => $user_github->email,
    ], [
        'name' => $user_github->name,
        'email' => $user_github->email,
    ]);

    Auth::login($user, true);

    return redirect('/dashboard');
});

require __DIR__.'/auth.php';