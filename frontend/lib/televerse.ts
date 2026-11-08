/**
 * Est-ce un fichier televerse depuis l'administration ?
 *
 * `next/image` optimise en allant rechercher l'image lui-meme, depuis le
 * serveur. Pour un fichier televerse, cette requete repart vers l'API —
 * ASSET_URL nomme l'adresse IP, derriere un certificat auto-signe — et la
 * poignee de main echoue : l'optimiseur rend null, et la carte n'affiche
 * plus que son texte alternatif. C'est ce qu'a vu le client sur la photo
 * d'une paneliste, enregistree et pourtant absente de la page publique.
 *
 * Le test portait sur « http » seul, du temps ou l'API renvoyait une adresse
 * complete. Elle renvoie desormais un chemin — « /storage/... » — que ce test
 * laissait passer a l'optimiseur.
 *
 * Les images livrees avec le site, elles, sont locales et s'optimisent
 * normalement : « /sane-deal3.webp », « /new-logo.png ».
 */
export function estTeleverse(src: string | null | undefined): boolean {
  if (!src) return false;

  return src.startsWith("http") || src.startsWith("/storage/");
}
