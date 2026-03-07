<script lang="ts">
  interface CheckBoxProps {
    text: string;
    checked?: boolean;
    checkSize?: string;
    checkWidth?: string;
    checkBorder?: string;
    onchange?: (event: Event) => void;
  }

  let {
    text,
    checked = $bindable(false),
    checkSize = "14px",
    checkWidth = "30px",
    checkBorder = "1px",
    onchange,
  }: CheckBoxProps = $props();
</script>

<div
  style={`
    --checkSize: ${checkSize};
    --checkWidth: ${checkWidth};
    --checkBorder: ${checkBorder};
  `}
>
  <label>
    <input bind:checked type="checkbox" onchange={onchange} />
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
</style>
