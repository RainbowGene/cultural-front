<template>
  <!-- 栏目选择器 -->
  <div>
    <el-cascader
      v-model="props.areaId"
      :options="areaList"
      :props="props1"
      @change="onChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  areaId: {
    value: Number,
  },
});

const api = {
  loadarea: "/content/areaList",
};

const areaList = ref([{ areaId: 0, areaName: "所有地区", children: [] }]);
const props1 = {
  checkStrictly: true,
  label: "areaName",
  value: "areaId",
};

const loadarea = async () => {
  let result = await proxy.Request({
    url: api.loadarea,
  });
  if (!result) {
    return;
  }
  areaList.value[0].children = result.data;
};
loadarea();

const emit = defineEmits(["update:areaId", "change"]);

const onChange = (e) => {
  emit("update:areaId", e);
  emit("change", e);
};
</script>

<style lang="scss" scoped></style>
