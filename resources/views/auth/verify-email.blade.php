<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot your password</title>
  <meta name="description" content="DevChallenge Login/Register application">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
  <link rel="stylesheet" href="{{ asset('css/tabler-io/webfont/tabler-icons.min.css') }}">

  <!-- <meta http-equiv="refresh" content="5"> -->

  @vite(['resources/js/app.js'])
</head>
<body>
  <section class="section section--verify-email">
    <h1 class="verify-email__heading">We've sent an email!</h1>
    <p class="verify-email__description">
      Thanks for signing up! Before getting started, could you 
      verify your email address by clicking on the link we just 
      emailed to you? If you didn't receive the email, we will 
      gladly send you another.
    </p>
    @if (session('status') == 'verification-link-sent')
      <p class="verify-email__new-email-send">
        A new verification link has been sent to the email address you 
        provided during registration.
      </p>
    @endif
    <form class="form form--verify-email" action="{{ route('verification.send') }}" method="POST">
      @csrf
      <div class="form__options">
        <button class="submit-btn">
          <span>Resend verification email</span>
          <i class="submit-btn__icon ti ti-arrow-right"></i>
        </button>
      </div>
    </form>
    <form class="form form--logout" action="{{ route('logout') }}" method="POST">
      @csrf
      <div class="form__options">
        <button class="submit-btn submit-btn--logout">
          <span>Log out</span>
        </button>
      </div>
    </form>
  </section>
</body>
</html>