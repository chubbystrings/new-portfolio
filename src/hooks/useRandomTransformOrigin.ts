


export const useRandomTransformOrigin = () => {

    const getRandomTransformOrigin = () => {
        const value = (16 + 40 * Math.random()) / 100;
        const value2 = (15 + 36 * Math.random()) / 100;
        return {
          originX: value,
          originY: value2,
        };
      };

      return { getRandomTransformOrigin}
  }