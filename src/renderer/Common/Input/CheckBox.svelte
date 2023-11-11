<script lang="ts">
  export let text: string;
  export let checked: boolean;

  export let checkSize = "14px";
  export let checkWidth = "30px";
  export let checkBorder = "1px";
</script>

<div
  style={`
    --checkSize: ${checkSize};
    --checkWidth: ${checkWidth};
    --checkBorder: ${checkBorder};
  `}
>
  <label>
    <input on:change bind:checked type="checkbox" />
    <span>{text}</span>
  </label>
</div>

<style>
  div {
    display: inline-flex;
    align-items: center;
    color: var(--text);

    position: relative;
    padding: 6px 0;
  }
  div > label {
    position: relative;
  }
  div > label:hover {
    cursor: pointer;
  }

  div > label > span {
    position: relative;
    padding-left: 40px;
    user-select: none;
  }
  div > label > span::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 1px;
    width: var(--checkWidth);
    height: var(--checkSize);
    background-color: var(--white_1);
    border: var(--checkBorder) solid var(--borders);
    border-radius: var(--checkSize);
    transition: all 0.1s ease;
  }
  div > label > span:hover::before {
    box-shadow: 0 0 1px 0px var(--black_2);
  }
  div > label > span::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 1px;
    width: var(--checkSize);
    height: var(--checkSize);
    background-color: var(--bg-header);
    border: var(--checkBorder) solid var(--borders);
    border-radius: var(--checkSize);
    transition: all 0.2s ease;
  }
  div > label > input[type="checkbox"]:checked ~ span::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 0px;
    width: var(--checkWidth);
    height: var(--checkSize);
    background-color: var(--bg-header);
    border: var(--checkBorder) solid var(--borders);
    border-radius: var(--checkSize);
    transition: all 0.1s ease;
  }
  div > label > input[type="checkbox"]:checked ~ span::after {
    content: "";
    position: absolute;
    top: 3px;
    left: calc(var(--checkWidth) - var(--checkSize));
    width: var(--checkSize);
    height: var(--checkSize);
    background-color: var(--white_1);
    border: 1px solid var(--black_2);
    border-radius: var(--checkSize);
    transition: all 0.2s ease;
  }

  div > label > input[type="checkbox"] {
    display: none;
  }

  /* div.disabled {
    position: relative;
  }
  div.disabled > label {
    position: relative;
  }
  div.disabled > label:hover {
    cursor: default;
  } */

  /* div.disabled > label > span:hover::before {
    box-shadow: 0 0 0px 0px transparent;
  }

  div.disabled > label > span::before {
    content: "";
    position: absolute;
    top: -2px;
    left: 0px;
    width: 45px;
    height: 20px;
    background-color: var(--borders);
    border: 1px solid var(--borders);
    border-radius: 20px;
    transition: all 0.1s ease;
  }
  div.disabled > label > span::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 3px;
    width: 16px;
    height: 16px;
    background-color: var(--borders);
    border: 1px solid var(--borders);
    border-radius: 20px;
    transition: all 0.2s ease;
  }

  div.disabled > label > input[type="checkbox"] {
    display: none;
  } */
</style>
