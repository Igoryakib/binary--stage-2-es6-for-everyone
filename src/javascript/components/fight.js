import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  const healthBarFirstFighter = document.querySelector('#left-fighter-indicator');
  const healthBarSecondFighter = document.querySelector('#right-fighter-indicator');
  let healthSecondFighter = secondFighter.health;
  let healthFirstFighter = firstFighter.health;
  let fighterAttacked = true;
  let criticalHit = true;
  let pressedKey = new Set();
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    window.addEventListener('keydown', (event) => {
      // attack logic
      // first fighter
      if (event.code === controls.PlayerOneAttack) {
        if (fighterAttacked) {
          let damage = getDamage(firstFighter, secondFighter)
          healthSecondFighter -= damage;
          healthBarSecondFighter.style.width = `${healthSecondFighter * 100 / secondFighter.health}%`;
        } else {
          return fighterAttacked = true;
        }
      }
      // second fighter
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
      // first fighter 
      pressedKey.add(event.code);
      let timerIdFirstFighter;
      if(pressedKey.has(controls.PlayerOneCriticalHitCombination[0]) && pressedKey.has(controls.PlayerOneCriticalHitCombination[1]) && pressedKey.has(controls.PlayerOneCriticalHitCombination[2])){
        pressedKey.clear();
        let CriticalDamage = getDamage(firstFighter, secondFighter, criticalHit);
        criticalHit = false;
        timerIdFirstFighter = setTimeout(() => {
          criticalHit = true;
          if (criticalHit) {
            clearTimeout(timerIdFirstFighter);
          }
        }, 10000)
        healthSecondFighter -= CriticalDamage;
        healthBarSecondFighter.style.width = `${healthSecondFighter * 100 / secondFighter.health}%`;
      }
      // second fighter
      let timerIdSecondFighter;
      if(pressedKey.has(controls.PlayerTwoCriticalHitCombination[0]) && pressedKey.has(controls.PlayerTwoCriticalHitCombination[1]) && pressedKey.has(controls.PlayerTwoCriticalHitCombination[2])){
        pressedKey.clear();
        let CriticalDamage = getDamage(secondFighter, firstFighter, criticalHit);
        criticalHit = false;
        timerIdSecondFighter = setTimeout(() => {
          criticalHit = true;
          if (criticalHit) {
            clearTimeout(timerIdSecondFighter);
          }
        }, 10000)
        healthFirstFighter -= CriticalDamage;
        healthBarFirstFighter.style.width = `${healthFirstFighter * 100 / firstFighter.health}%`;
      }
      // block logic
      // first fighter
      if (event.code === controls.PlayerOneBlock) {
        fighterAttacked = false;
       return getDamage(0, firstFighter);
      }
      // second fighter
      if (event.code === controls.PlayerTwoBlock) {
        fighterAttacked = false;
        return getDamage(0, secondFighter);
      }
      // choosing winner
      // first fighter
      if(healthSecondFighter <= 0) {
        healthBarSecondFighter.style.width = '0%';
        return resolve(firstFighter);
      }
      // second fighter
      if (healthFirstFighter <= 0) {
        healthBarFirstFighter.style.width = '0%';
        return resolve(secondFighter);
      }
    })
  });
}

export function getDamage(attacker, defender, criticalHit = 'block') {
  // return damage
  let hit = getHitPower(attacker);
  let block = getBlockPower(defender);
  if (criticalHit === true) {
    let criticalChance = getCriticalHitPower(attacker);
    return criticalChance;
  }
  if (!criticalHit) {
    return 0;
  }
  if (getHitPower(attacker) < getBlockPower(defender) || getHitPower(attacker) === 0) {
    return 0;
  }
  if((hit - block) < 0) {
    return 0;
  }
  if (criticalHit === 'block') {
    return hit - block;
  }
}

export function getHitPower(fighter) {
  // return hit power
  let criticalHitChance = Math.random() * (2 - 1) + 1;
  return (+fighter.attack ?? 0) * criticalHitChance;
}

export function getCriticalHitPower (fighter) {
  // return critical hit
  return (+fighter.attack ?? 0) * 2;
}

export function getBlockPower(fighter) {
  // return block power
  let dodgeChance = Math.random() * (2 - 1) + 1
  return +fighter?.defense * dodgeChance;
}
