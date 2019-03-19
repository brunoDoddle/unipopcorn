function hitTestRectangle(r1, r2) {
    r1.getBounds();
    r2.getBounds();

    //Calculate the `halfWidth` and `halfHeight` properties of the sprites
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
  
    //Calculate `centerX` and `centerY` properties on the sprites
    r1.centerX = r1._bounds.minX + r1.halfWidth;
    r1.centerY = r1._bounds.minY + r1.halfHeight;
    r2.centerX = r2._bounds.minX + r2.halfWidth;
    r2.centerY = r2._bounds.minY + r2.halfHeight;
  
    //Create a `collision` variable that will tell us
    //if a collision is occurring
    let collision = false;
  
    //Check whether the shapes of the sprites are overlapping. If they
    //are, set `collision` to `true`
    if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
    && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
      collision = true;
    }
  
    //Return the value of `collision` back to the main program
    return collision;
  }

  export default hitTestRectangle;