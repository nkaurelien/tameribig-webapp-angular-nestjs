import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold mb-2">Nous contacter</h1>
      <p class="text-base-content/60 mb-8">
        Une question, une suggestion ou un partenariat ? Écrivez-nous.
      </p>

      <div class="grid gap-8 md:grid-cols-3">
        <!-- Contact info -->
        <div class="md:col-span-1 space-y-6">
          <div>
            <h3 class="font-semibold text-sm mb-1">Email</h3>
            <p class="text-sm text-base-content/60">
              contact&#64;tameribig.kamitbrains.fr
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-sm mb-1">Réseaux sociaux</h3>
            <div class="flex gap-3">
              <span class="badge badge-outline badge-sm">Facebook</span>
              <span class="badge badge-outline badge-sm">Instagram</span>
              <span class="badge badge-outline badge-sm">Twitter</span>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-sm mb-1">Horaires</h3>
            <p class="text-sm text-base-content/60">
              Lundi – Vendredi : 8h – 18h<br />
              Samedi : 9h – 15h
            </p>
          </div>
        </div>

        <!-- Contact form -->
        <div class="md:col-span-2">
          @if (sent()) {
            <div role="alert" class="alert alert-success">
              <span
                >Votre message a été envoyé. Nous vous répondrons dans les
                meilleurs délais.</span
              >
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Nom</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="name"
                    name="name"
                    required
                    placeholder="Votre nom"
                    class="input input-bordered w-full"
                  />
                </div>
                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    placeholder="vous&#64;exemple.com"
                    class="input input-bordered w-full"
                  />
                </div>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">Objet</span>
                </label>
                <select
                  [(ngModel)]="subject"
                  name="subject"
                  class="select select-bordered w-full"
                >
                  <option value="" disabled>Choisir un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="press">Presse & médias</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">Message</span>
                </label>
                <textarea
                  [(ngModel)]="message"
                  name="message"
                  required
                  rows="5"
                  placeholder="Décrivez votre demande..."
                  class="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <button
                type="submit"
                [disabled]="sending()"
                class="btn btn-primary"
              >
                @if (sending()) {
                  <span class="loading loading-spinner loading-sm"></span>
                }
                Envoyer le message
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';
  sending = signal(false);
  sent = signal(false);

  onSubmit() {
    this.sending.set(true);
    // TODO: connect to backend contact endpoint
    setTimeout(() => {
      this.sending.set(false);
      this.sent.set(true);
    }, 1000);
  }
}
