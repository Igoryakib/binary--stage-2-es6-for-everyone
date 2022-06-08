import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  const healthBarFirstFighter = document.querySelector('#left-fighter-indicator');
  const healthBarSecondFighter = document.querySelector('#right-fighter-indicator');
  let healthSecondFighter = secondFighter.health;
  let healthFirstFighter = firstFighter.health;
  let fighterAttacked = true;
  let criticalHit = false;
  let pressedKey = new Set();
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    window.addEventListener('keydown', (event) => {
      // attack logic
      if (event.code === controls.PlayerOneAttack) {
        if (fighterAttacked) {
          let damage = getDamage(firstFighter, secondFighter)
          healthSecondFighter -= damage;
          healthBarSecondFighter.style.width = `${healthSecondFighter * 100 / secondFighter.health}%`;
        } else {
          return fighterAttacked = true;
        }
      }
      if (event.code === controls.PlayerTwoAttack) {
        if(fighterAttacked) {
          let damage = getDamage(secondFighter, firstFighter)
          healthFirstFighter -= damage;
          healthBarFirstFighter.style.width = `${healthFirstFighter * 100 / firstFighter.health}%`;
        } else {
          return fighterAttacked = true;
        }
      }
      // critical hit logic 
      pressedKey.add(event.code);
      let timerId;
      if(pressedKey.has(controls.PlayerOneCriticalHitCombination[0]) && pressedKey.has(controls.PlayerOneCriticalHitCombination[1]) && pressedKey.has(controls.PlayerOneCriticalHitCombination[2])){
        pressedKey.clear();
        clearTimeout(timerId);
        criticalHit = true;
        let damage = getDamage(firstFighter, secondFighter, criticalHit)
        healthSecondFighter -= damage;
        healthBarSecondFighter.style.width = `${healthSecondFighter * 100 / secondFighter.health}%`;
      } else {
      }
      // block logic
      if (event.code === controls.PlayerOneBlock) {
        fighterAttacked = false;
       return getDamage(0, firstFighter);
      }
      if (event.code === controls.PlayerTwoBlock) {
        fighterAttacked = false;
        return getDamage(0, secondFighter);
      }
      // choosing winner
      if(healthSecondFighter <= 0) {
        healthBarSecondFighter.style.width = '0%';
        return resolve(firstFighter);
      }
      if (healthFirstFighter <= 0) {
        healthBarFirstFighter.style.width = '0%';
        return resolve(secondFighter);
      }
    })
  });
}

export function getDamage(attacker, defender, criticalHit = false) {
  // return damage
  if (getHitPower(attacker, criticalHit) < getBlockPower(defender) || getHitPower(attacker) === 0) {
    return 0;
  }
  let hit = getHitPower(attacker, criticalHit);
  let block = getBlockPower(defender);
  if((hit - block) < 0) {
    return 0;
  }
  return hit - block;
}

export function getHitPower(fighter, criticalHit) {
  // return hit power
  if (criticalHit) {
    criticalHit = false;
    return (2 * (+fighter.attack ?? 0) ) * Math.random() * (2 - 1) + 1
  }
  return (+fighter.attack ?? 0) * Math.random() * (2 - 1) + 1;
}

export function getBlockPower(fighter) {
  // return block power
  return +fighter?.defense * Math.random() * (2 - 1) + 1;
}
