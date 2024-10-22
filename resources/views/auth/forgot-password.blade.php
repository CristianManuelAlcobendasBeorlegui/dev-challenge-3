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
  <section class="section section--forgot-password">
    <h1 class="forgot-password__heading">Forgot your password?</h1>
    <p class="forgot-password__description">
      Don't worry, just let us know your email address and we will send an 
      email with a password reset link that will allow you to choose a new 
      one.
    </p>
    <form class="form form--forgot-password" action="{{ route('password.email') }}" method="POST">
      @csrf
      <div class="form__input-boxes">
        <div class="form__input-box">
          <div class="input-box__field">
            <input type="email" name="email" id="email" class="field__input" required autofocus>
            <i class="field__icon ti ti-mail-filled"></i>
          </div>
          <div class="input-box__status input-box__status--error">
            @php($messages = $errors->get('email'))
            @if ($messages)
              <ul class="error__list-items">
                @foreach ((array) $messages as $message)
                  <li class="error__list-item">{{ $message }}</li>
                @endforeach
              </ul>
            @endif
          </div>
        </div>
      </div>
      <div class="form__options">
        <button class="submit-btn">
          <span>Send password reset link email</span>
          <i class="submit-btn__icon ti ti-arrow-right"></i>
        </button>
      </div>
    </form>
  </section>
</body>
</html>