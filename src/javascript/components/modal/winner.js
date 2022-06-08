import {showModal} from './modal';
import {createFighterPreview} from '../fighterPreview';

export function showWinnerModal(fighter) {
  // call showModal function 
  let fighterElement = createFighterPreview(fighter, 'right');
  fighterElement.classList.add('winner-preview');
  showModal({title: "Winner", bodyElement: fighterElement}); 
}
