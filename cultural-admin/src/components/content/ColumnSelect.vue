<template>
  <!-- 栏目选择器 -->
  <div>
    <el-cascader
      v-model="props.columnId"
      :options="columnList"
      :props="props1"
      @change="onChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  columnId: {
    value: Number,
  },
});

const api = {
  loadcolumn: "/content/columnList",
};

const columnList = ref([{ columnId: 0, columnName: "一级栏目", children: [] }]);
const props1 = {
  checkStrictly: true,
  label: "columnName",
  value: "columnId",
};

const ceshi = [
  {
    columnId: 1,
    columnName: "测试栏目1",
    children: [{ columnId: 3, columnName: "测试栏目3" }],
  },
  { columnId: 2, columnName: "测试栏目2" },
];

const loadcolumn = async () => {
  let result = await proxy.Request({
    url: api.loadcolumn,
  });
  if (!result) {
    return;
  }
  columnList.value[0].children = result.data;
};
loadcolumn();

const emit = defineEmits(["update:columnId", "change"]);

const onChange = (e) => {
  emit("update:columnId", e);
  emit("change", e);
};
</script>

<style lang="scss" scoped></style>
