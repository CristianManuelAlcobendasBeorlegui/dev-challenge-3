<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopping list management</title>
  <meta name="description" content="Manage different shopping lists or share them to people you want collaborate.">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <link rel="stylesheet" href="{{ asset('css/shopping-list.css') }}">
  <link rel="stylesheet" href="{{ asset('css/tabler-io/webfont/tabler-icons.min.css') }}">
  <script src="{{ asset('js/ValidationError.js')}}"></script>
  <script src="{{ asset('js/shopping-list.js') }}"></script>
</head>
<body>
  <section class="section section--shopping-list-manager">
    <aside class="aside" tabindex="0">
      <div class="aside__header">
        <div class="aside__options">
          <div class="aside__option aside__option--close-aside" title="Close"  tabindex="0">
            <i class="ti ti-x aside__option-icon"></i>
          </div>
        </div>
      </div>
      <div class="aside__user-data">
        <img src="{{ asset('img/un-gatito--comprimido.png') }}" alt="User's profile image" class="aside__user-image">
        <div class="aside__user-name">
          <div class="aside__user-input-box">
            @php
              $email = auth()->user()->email;
            @endphp
            <input type="text" value="{{ $email }}" class="aside__user-input-field">
            
          </div>
        </div>
      </div>
      <div class="aside__shopping-lists">
        <div class="aside__shopping-list aside__shopping-list--own-lists">
          <div class="aside__shopping-list-heading">
            <i class="ti ti-shopping-cart aside__shopping-list-heading-icon"></i>
            <span class="aside__shopping-list-heading-text">Your lists</span>
          </div>
          <div class="aside__shopping-list-main-content">
            <div class="aside__no-list-message">
              There's no list, start creating one!
            </div>
            <div class="aside__lists"></div>
            <button class="aside__add-list-button">
              <i class="ti ti-shopping-cart-plus aside__add-list-button-icon"></i>
              <span class="aside__add-list-button-name">Add list</span>
            </button>
          </div>
        </div>
        <div class="aside__shopping-list aside__shopping-list--shared-lists">
          <div class="aside__shopping-list-heading">
            <i class="ti ti-shopping-cart-share aside__shopping-list-heading-icon"></i>
            <span class="aside__shopping-list-heading-text">Shared lists</span>
          </div>
          <div class="aside__shopping-list-main-content">
            <div class="aside__no-list-message">
              No one shared any list with you 😢
            </div>
            <div class="aside__lists"></div>
          </div>
        </div>
      </div>
    </aside>
    <div class="main-content">
      <div class="main-content__options">
        <div class="main-content__option main-content__option--open-aside">
          <i class="ti ti-menu-2 main-content__option-icon"></i>
        </div>
      </div>
      <div class="create-your-first-list">
        <i class="ti ti-list-check check-your-first-list__icon"></i>
        <h1 class="create-your-first-list__heading">Let's get start</h1>
        <p class="create-your-first-list__description">
          From here you can <span class="featured-word">manage</span> your shopping lists, creating them or 
          sharing them with whoever you want to see them.
        </p>
        <button class="create-your-first-list__cta-button">
          <i class="ti ti-shopping-cart-plus create-your-first-list__cta-button-icon"></i>
          <span class="create-your-first-list__cta-button-text">Create shopping list!</span>
        </button>
      </div>
      <div class="what-can-i-do">
        <i class="ti ti-checklist what-can-i-do__icon"></i>
        <h1 class="what-can-i-do__heading">Manage your lists</h1>
        <p class="what-can-i-do__description">
          <span class="featured-word">Create</span>, <span class="featured-word">select</span> or <span class="featured-word">share</span> a shopping list!
        </p>
      </div>
      <div class="list-views"></div>
    </div>
    <div class="utils">
      <datalist id="market-suggestions">
      </datalist>
    </div>
  </section>
</body>
</html>