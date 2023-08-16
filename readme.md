<center>
🚧 🚧 🚧

🚧 <strong>Huom!</strong> MyHelsinki Open API on lakkautettu, joten tämä tehtävä ei ole enää toimintakunnossa. 🚧

🚧 🚧 🚧
</center>

# TypeScript: Tapahtumien suodattaminen ja lajittelu

Tämän tehtävän tarkoituksena on harjoitella sisäkkäisistä tietorakenteista koostuvan aineiston suodattamista sekä järjestämistä eli lajittelua tiettyjen ehtojen mukaisesti.

Aineistona käytämme [MyHelsinki Open API](https://open-api.myhelsinki.fi/) -nimisen REST-rajapinnan tarjoamia tapahtumatietoja. Rajapinnan vastaus koostuu JSON-rakenteessa, jonka sisällä on taulukko tapahtumista, joilla on jokaisella tiedot niiden ajankohdasta, nimistä, sijainnista ja muista tarpeellisista tiedoista.


## GitHub classroom

Tehtävä arvostellaan käyttäen [GitHub classroom](https://classroom.github.com/) -palvelua, joka suorittaa ohjelmasi ja tarkastaa sekä pisteyttää tulokset automaattisesti. Taustalla GitHub classroom hyödyntää [GitHub actions](https://github.com/features/actions) -nimistä jatkuvan integroinnin palvelua, johon tutustumme kurssilla lisää myöhemmillä viikoilla.

Voit tarvittaessa lähettää tehtävän tarkastettavaksi monta kertaa. Tee tällöin uusi commit ja vie (push) muutokset GitHubiin. Varmista kuitenkin, että viimeisin tekemäsi commit tuottaa parhaat pisteet.

Kun olet hyväksynyt tehtävän GitHub classroomissa ja saanut repositoriosta henkilökohtaisen kopion, kloonaa se itsellesi `git clone` -komennolla. Siirry sen jälkeen VS Codeen editoimaan tiedostoja.

Kloonatessasi repositoriota **varmista, että Git-osoitteen lopussa on oma GitHub-käyttäjänimesi**. Jos käyttäjänimesi puuttuu osoitteesta, kyseessä ei ole henkilökohtainen kopiosi tehtävästä. Luo tässä tapauksessa oma classroom-kopio tehtävästä itsellesi Teams-tehtävästä löytyvän linkin avulla.

💡 Automaattisen arvioinnin vuoksi et saa muuttaa annettujen tiedostojen ja funktioiden nimiä, etkä parametrien ja paluuarvojen tyyppejä.


## Riippuvuuksien asentaminen

Aloita asentamalla projektin riippuvuudet, jotka on määritelty `package.json`-tiedostossa:

```sh
$ npm install
```

Riippuvuudet sisältävät sekä [TypeScript-kielen](https://www.npmjs.com/package/typescript), [Jest-testaustyökalun](https://www.npmjs.com/package/jest) että [`ts-node`](https://www.npmjs.com/package/ts-node)- ja [`ts-jest`](https://www.npmjs.com/package/ts-jest)-paketit TypeScript-kielisen koodin ja testien suorittamiseksi Node.js:llä.

Lisäksi riippuvuuksista löytyy [`node-fetch`](https://www.npmjs.com/package/node-fetch), joka mahdollistaa selaimista tutun `fetch`-funktion hyödyntämisen REST-rajapinnan kutsumiseksi. Node.js:n [versiosta 18 alkaen](https://nodejs.org/dist/latest/docs/api/globals.html#fetch) `fetch`-funktio kuuluu osaksi standardikirjastoa, eikä vaadi enää erillistä asennusta. Node.js sinulta tulee löytyä valmiina.


## Lajiteltava aineisto

[MyHelsinki Open API](https://open-api.myhelsinki.fi/) on MyHelsinki.fi-sivuston avoin REST-rajapinta kaupungin tapahtumien, paikkojen ja aktiviteettien tietoihin:

> *"MyHelsinki.fi-sivuston teknisestä toiminnasta ja tietojen päivittämisestä vastaa Helsinki Partners. Helsinki Partners on kansainväliseen kaupunkimarkkinointiin sekä investointien että osaajien houkutteluun keskittyvä Helsingin kaupungin omistama yhtiö. Lue lisää ja ota yhteyttä osoitteessa [helsinkipartners.com](https://www.helsinkipartners.com/)."*
>
> https://www.myhelsinki.fi/fi/yhteystiedot

Rajapinnan dokumentaatio löytyy interaktiivisessa [Swagger](https://swagger.io/)-muodossa osoitteesta [https://open-api.myhelsinki.fi/doc](https://open-api.myhelsinki.fi/doc). Kyseisessä osoitteessa on dokumentoituna esimerkkeineen eri resurssien URL-osoitteet, niiden tukemat parametrit ja JSON-tietueiden rakenteet.

Tässä tehtävässä hyödynnämme rajapinnan tarjoamaa **tapahtuma-aineistoa** osoitteesta [https://open-api.myhelsinki.fi/v1/events/](https://open-api.myhelsinki.fi/v1/events/). Aineiston hakua ei tarvitse toteuttaa itse, vaan selöytyy valmiina [src/client.ts](./src/client.ts)-tiedostosta. Tapahtumien hakeminen onnistuu esimerkiksi seuraavasti:

```ts
import { Event } from "./types/Event";
import { getEvents } from "./client";

//...

let events: Event[] = await getEvents();
```

Karkeasti supistettuna rajapinnasta saatu vastaus voi näyttää esimerkiksi seuraavalta:

```json
{
  "meta": {},
  "data": [
    {
      "id": "abc123",
      "name": {
        "fi": "Suomenkielinen tapahtuman nimi",
        "en": "English name",
        "sv": "samma på svenska",
        "zh": "标题"
      },
      "description": {
        "intro": "",
        "body": ""
      },
      "event_dates": {
        "starting_day": "2025-10-24T16:00:00.000Z",
        "ending_day": "2025-10-24T17:00:00.000Z"
      }
    }
  ]
}
```

Tehtävässä tätä tietorakennetta vastaava hieman yksinkertaistettu tyyppi on valmiiksi määritettynä [src/types/Event.ts](./src/types/Event.ts)-tiedostossa. Tietojen haku on puolestaan toteutettu [src/client.ts](./src/client.ts)-tiedostoon. Näitä tiedostoja ei tarvitse muokata.


## Ohjelman suorittaminen

Tehtävän yksinkertainen tekstikäyttöliittymä on toteutettu valmiiksi [`src/index.ts`-tiedostossa](./src/index.ts). Käyttöliittymän on tarkoitus hakea tapahtumatiedot rajapinnasta ja tulostaa seuraavan viikon tapahtumat kasvavassa järjestyksessä niiden alkamisajan mukaan. Ohjelma voidaan suorittaa `ts-node`-työkalulla seuraavasti:

```
$ npx ts-node src/index.ts
```

Mikäli ohjelma lajittelee ja suodattaa tapahtumat oikein, on sen tuloste muodoltaan seuraava. Ohjelman päivämäärät ja kellonajat muotoillaan käyttöjärjestelmän asetusten mukaisesti, joten oma tulosteesi voi poiketa alla esitetystä:

```md
# Events from MyHelsinki Open API

## 2/3/2023

 * 2:00:00 PM: Selkokirjan lukemisen klubi
 * 3:00:00 PM: Lasten perjantaileffa
 * 3:00:00 PM: Ukulelejamit
 * 3:00:00 PM: Maunula-talon elokuvakerho: Hytti nro 6
 * 3:00:00 PM: K-pop alkeet alle 13v Itäkeskus
 * 4:00:00 PM: Sellon kirjaston lasten perjantaileffa
 * 4:00:00 PM: Lukubileet

## 2/4/2023

 * 7:00:00 AM: Kudonta
 * 7:00:00 AM: Omatoimipaja
 * 8:00:00 AM: Akseli Gallen-Kallelan julistenäyttely Paluu Keniaan
 * 8:00:00 AM: Soile Lehdon maalauksia
 * 8:00:00 AM: Haltian helmikuun retkilauantai
 * 8:00:00 AM: Muumipeikon talvirieha
...
```

Annettu koodi huolehtii tapahtumien tulostamisesta, mutta **tapahtumat ovat väärässä järjestyksessä** ja **tapahtumien alkamisaikaa ei ole rajoitettu**.

Kutsut tapahtumien suodattamiseksi ja lajittelemiseksi ovat valmiiksi paikoillaan [src/index.ts](./src/index.ts)-tiedostossa, mutta sinun tehtäväsi on toteuttaa varsinainen logiikka aineiston [suodattamiseksi](./src/filtering.ts) ja [lajittelemiseksi](./src/sorting.ts).


## Osa 1: aineiston suodattaminen (2 pistettä)

Tiedostossa [src/filtering.ts](./src/filtering.ts) on määriteltynä seuraava funktio:

```ts
/**
 * Returns a new array of Events that only contains those events from the given `events` array
 * that have their starting_day between the two given `Date` objects.
 */
export function filterEventsByStartDate(events: Event[], minDate: Date, maxDate: Date): Event[] {

}
```

Tehtäväsi on toteuttaa tähän funktioon toimintalogiikka, joka suodattaa annetuista tapahtumista sellaiset, joiden alkamisaika (`event_dates.starting_day`) sijoittuu annetun minimi- ja maksimiajan väliin.

Huomaa, että kaikilla rajapinnan palauttamilla tapahtumilla ei välttämättä ole alkamisaikaa. **Tuntemattoman ajankohdan tapahtumat tulee suodattaa pois aineistosta.**

Huomaa myös, että **käsiteltävässä tietorakenteessa päivämäärät ovat merkkijonoja**, kuten `"2025-10-24T16:00:00.000Z"`. Funktiolle annettavat parametrit ovat puolestaan [Date-olioita](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Voit hyödyntää päivämäärien muuntamisessa ja käsittelyssä halutessasi erillisiä npm-paketteja, mutta pärjäät myös hyvin ilman. Tässä voi olla apua esim. seuraavista:

* [`Date`-luokan konstruktori](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#constructor)
* [`getTime()`-metodi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
* [Nullish coalescing operator (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
* [Optional chaining (`?.`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

Voit ajaa vain [suodattamista koskevat testit](./src/filtering.test.ts) seuraavalla komennolla:

```sh
$ npm test src/filtering.test.ts
```

Testien kuvaukset voivat auttaa hahmottamaan, minkälaisia tapauksia logiikassa tulee ottaa huomioon:

```
PASS  src/filtering.test.ts
filtering events
  ✓ events with no date are excluded
  ✓ past events are excluded
  ✓ future events are excluded
  ✓ events in the range are included
  ✓ function does not modify the given array
```


## Osa 2: tapahtumien lajittelu (3 pistettä)

Tehtävän toisessa osassa sinun tulee **järjestää** eli **lajitella** tapahtumat niiden alkamisajan mukaan käyttäen **itse toteuttamaasi lajittelualgoritmia**.

> *"Some examples where you can find direct application of sorting techniques include: Sorting by price, popularity etc in e-commerce websites"*
>
> [The Ohio State University. 7 algorithms and data structures every programmer must know](https://u.osu.edu/cstutorials/2016/11/21/7-algorithms-and-data-structures-every-programmer-must-know/)

Tiedostossa [src/sorting.ts](./src/sorting.ts) on määriteltynä seuraava funktio:

```ts
/**
 * Returns a new array, where all Events from the given array are sorted by their
 * `starting_day` in ascending order.
 */
export function sortEventsByStartDate(events: Event[]): Event[] {
    // note! Using the existing `sort` method is forbidden!
}
```

Toteuta lajittelulogiikkasi tähän funktioon siten, että funktio palauttaa lopuksi uuden tapahtumataulukon, joka on lajiteltu tapahtuman alkamisajan mukaan kasvavassa järjestyksessä. Voit halutessasi toteuttaa myös erillisiä apufunktioita.

Huomaa, että koodisi tulee lajitella **kokonaisia tapahtumatietueita**, eli et voi poimia aineistosta esimerkiksi pelkkiä nimiä ja alkamisaikoja.

**Huom!** Kaikilla tapahtumilla ei välttämättä ole alkamisaikaa tiedossa, eli alkamisaika voi olla `null` tai `undefined`. Tällaiset tapahtumat tulee lajitella aineiston **alkuun** ennen muita tapahtumia.

🚨 **Tämän harjoituksen tavoitteena on opetella itse toteuttamaan jokin tunnettu lajittelualgoritmi, joten JavaScriptin valmiin `Array.sort`-funktion käyttämistä ei sallita.** 🚨

Voit ajaa vain [lajittelua koskevat testit](./src/sorting.test.ts) seuraavalla komennolla:

```sh
$ npm test src/sorting.test.ts
```

Testien kuvaukset voivat auttaa hahmottamaan, minkälaisia tapauksia logiikassa tulee ottaa huomioon:

```
PASS  src/sorting.test.ts
sorting events by starting date
  ✓ events are sorted in correct order
  ✓ sorting handles events with identical dates correctly
  ✓ sorting an empty array should not throw exceptions
  ✓ sorting events without dates should not throw exceptions
  ✓ events with no date are in the beginning of the sorted array
  ✓ sorting does not modify the original array
  ✓ sorting is not allowed to utilize Array.sort
```

### Yleisimmät lajittelualgoritmit

Voit valita toteutettavan lajittelualgoritmin esimerkiksi seuraavista:

**Lisäyslajittelu eli Insertion Sort**

[https://en.wikipedia.org/wiki/Insertion_sort](https://en.wikipedia.org/wiki/Insertion_sort)

<a title="Simpsons contributor / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Insertion_sort.gif"><img height="256" alt="Insertion sort" src="https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif"></a>

*Kuva: By Simpsons contributor - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=17512147](https://commons.wikimedia.org/w/index.php?curid=17512147)*

**Lomituslajittelu eli Merge Sort**

[https://en.wikipedia.org/wiki/Merge_sort](https://en.wikipedia.org/wiki/Merge_sort)

<a title="Swfung8 / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Merge-sort-example-300px.gif"><img width="256" alt="Merge-sort-example-300px" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif" style="border solid silver 1px;"></a>

*Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14961648](https://commons.wikimedia.org/w/index.php?curid=14961648)*

**Kuplalajittelu eli Bubble Sort**

[https://en.wikipedia.org/wiki/Bubble_sort](https://en.wikipedia.org/wiki/Bubble_sort)

<a href="https://commons.wikimedia.org/wiki/File:Bubble-sort-example-300px.gif#/media/File:Bubble-sort-example-300px.gif" title="By Swfung8 - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=14953478"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif" alt="Bubble-sort-example-300px.gif" width="256" style="border solid silver 1px;"></a>

*Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14953478](https://commons.wikimedia.org/w/index.php?curid=14953478)*

**Pikalajittelu eli Quicksort**

[https://en.wikipedia.org/wiki/Quicksort](https://en.wikipedia.org/wiki/Quicksort)

<a href="https://commons.wikimedia.org/wiki/File:Sorting_quicksort_anim.gif#/media/File:Sorting_quicksort_anim.gif" title="By en:User:RolandH, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1965827"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif" alt="Sorting quicksort anim.gif" width="256" style="border solid silver 1px;"></a>

*Kuva: By en:User:RolandH, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=1965827](https://commons.wikimedia.org/w/index.php?curid=1965827)*


### Algoritmin valintaperusteet

Voit valita itsellesi mieluisen algoritmin esimerkiksi tutustumalla ensin niiden tehokkuuteen. Voit myös hyvin valita sen, joka vaikuttaa toteutukseltaan sopivan yksinkertaiselta. Muista myös, että voit kysyä Teamsissa neuvoa mihin vain tehtävässä kohtaamaasi haasteeseen liittyen. Todennäköisesti samojen haasteiden parissa kamppailee myös moni muu kurssilainen.

Arvioi lopuksi tehtävää ratkaistessasi lajitteluun kuluvaa aikaa. Miten esimerkiksi aineiston koon kaksinkertaistaminen vaikuttaisi ohjelmasi suoritusaikaan? Kirjoita yhden virkkeen pituinen arvio suorituskyvystä funktiosi yhteyteen kommenttina.

**Huom!** Oikeassa ohjelmistoprojektissa käyttäisit JavaScriptin `Array.sort`-funktiota ja antaisit sille parametrina kahden tapahtuman ajankohtia vertailevan vertailufunktion. Voit tutustua aiheeseen esim. [mdn web docs -sivustolla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Tässä tehtävässä kuitenkin harjoitellaan algoritmin toteutusta, joten kirjoitamme lajittelun itse.


## Tehtävän testaaminen

Tehtävän yksikkötestit suoritetaan [Jest-työkalun](https://jestjs.io/) avulla komennolla `npm test`:

```sh
$ npm test          # sama kuin `npx jest --verbose --coverage`
```

Varsinaiset testit löytyvät tiedostoista [src/filtering.test.ts](./src/filtering.test.ts) ja [src/sorting.test.ts](./src/sorting.test.ts). Voit halutessasi perehtyä testien sisältöön, mutta se ei ole tehtävän ratkaisemiseksi välttämätöntä.


----

## Lisenssit ja tekijänoikeudet

Tämän oppimateriaalin on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).


## MyHelsinki Open API

> *"Note that all of the information provided over the API is open data with the exception of image files. When using images, please refer to the license terms included with each image.*"
>
> MyHelsinki Open API. https://open-api.myhelsinki.fi/

MyHelsinki Open API:n aineisto on kuvia lukuun ottamatta lisensoitu [Creative Commons BY 4.0](https://open-api.myhelsinki.fi/terms)-lisenssillä. Voit lukea tarkemmat käyttöehdot ositteesta https://open-api.myhelsinki.fi/terms.