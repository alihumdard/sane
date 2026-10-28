<x-mail::message>
# Nouveau message depuis le site

**{{ $nom }}** a écrit depuis la page Contact.

<x-mail::panel>
{{ $message }}
</x-mail::panel>

- **Sujet :** {{ $sujet }}
- **Email :** {{ $email }}
@if ($telephone)
- **Téléphone :** {{ $telephone }}
@endif

Répondez directement à ce message : il repartira vers {{ $email }}.

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
