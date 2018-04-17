import { graphql } from "react-apollo";
import ListRecipes from "./queries/ListRecipes";
import NewRecipeSubscription from "./subscriptions/NewRecipeSubscription";

class Recipes extends React.Component {
  /* class omitted for now */
}

export default graphql(ListRecipes, {
  options: {
    fetchPolicy: "cache-and-network"
  },
  props: props => ({
    recipes: props.data.listRecipes ? props.data.listRecipes.items : [],
    subscribeToNewRecipes: params => {
      props.data.subscribeToMore({
        document: NewRecipeSubscription,
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { onCreateRecipe }
            }
          }
        ) => {
          return {
            ...prev,
            listRecipes: {
              __typename: "RecipeConnection",
              items: [
                onCreateRecipe,
                ...prev.listRecipes.items.filter(
                  recipe => recipe.id !== onCreateRecipe.id
                )
              ]
            }
          };
        }
      });
    }
  })
})(Recipes);
