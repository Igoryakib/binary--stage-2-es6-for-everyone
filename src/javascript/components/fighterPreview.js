import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)
  if (fighter) {
    const fighterName = createElement({tagName: 'h3', className: 'fighter-preview___name'});
    const fighterList = createElement({tagName: 'ul', className: 'fighter-preview___list'});
    const wrapperText = createElement({tagName: 'div', className: 'fighter-preview__wrapperText'});
    const fighterImage = createFighterImage(fighter);
    fighterName.innerText = fighter.name;
    fighterList.innerHTML = `
    <li><h4 class="fighter-preview___list-item">Attack: <span class="fighter-preview___list-item--color">${fighter.attack}</span></h4></li>
    <li><h4 class="fighter-preview___list-item">Defense: <span class="fighter-preview___list-item--color">${fighter.defense}</span></h4></li>
    <li><h4 class="fighter-preview___list-item">Health: <span class="fighter-preview___list-item--color">${fighter.health}</span></h4></li>`
    wrapperText.append(fighterName, fighterList);
    fighterElement.append(fighterImage, wrapperText);
    return fighterElement;
  }
  return ''; 
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
