import { Component } from '@angular/core';
import 'rxjs/Rx';

@Component({
    selector: 'pm-app',
    template: `
        <div>
            <div class='container' style="width: 100%">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
})

export class AppComponent{
    pageTitle: string = 'GQA Production Management';
}